import pandas as pd
import numpy as np
import torch
from torch import nn, optim
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import pickle
from pathlib import Path
from malaria_model import MalariaPredictor

# Load data
p = Path('data.xlsx')
if not p.exists():
    raise FileNotFoundError('data.xlsx not found')

df = pd.read_excel(p, header=1)
# Clean column names
cols = [c.strip() for c in df.columns.tolist()]
df.columns = cols

# Rename columns to predictable names
# Expected columns found in the file
# ['month','sick of malaria','min temp','avg temp','max temp','humidity (%)','rainy days','precipitaion (mm)']
expected = ['month','sick of malaria','min temp','avg temp','max temp','humidity (%)','rainy days','precipitaion (mm)']
# Trim any leading spaces in precip column
if 'precipitaion (mm)' not in df.columns and ' precipitaion (mm)' in df.columns:
    df = df.rename(columns={' precipitaion (mm)': 'precipitaion (mm)'})

# Drop rows with all NaNs
df = df.dropna(how='all')
# Convert numeric columns
num_cols = ['sick of malaria','min temp','avg temp','max temp','humidity (%)','rainy days','precipitaion (mm)']
for c in num_cols:
    df[c] = pd.to_numeric(df[c], errors='coerce')

# Fill any remaining NaNs with column median
for c in num_cols:
    if df[c].isna().any():
        df[c] = df[c].fillna(df[c].median())

# Create previousCases as lag of 'sick of malaria'
df['previousCases'] = df['sick of malaria'].shift(1).fillna(0)
# irrigation default 0
df['irrigation'] = 0

# Encode season from rainy days
# rainy days >5 => rainy, 1-5 -> transition, 0 -> dry
def season_from_rainy(days):
    if days > 5:
        return 'rainy'
    if days > 0:
        return 'transition'
    return 'dry'

df['season'] = df['rainy days'].apply(season_from_rainy)

# Build feature matrix to match frontend/backend inputs:
# temperature (avg temp), rainfall (precipitaion (mm)), humidity (%),
# breedingCount (rainy days), previousCases, irrigation, season
X = pd.DataFrame({
    'temperature': df['avg temp'],
    'rainfall': df['precipitaion (mm)'],
    'humidity': df['humidity (%)'],
    'breedingCount': df['rainy days'],
    'previousCases': df['previousCases'],
    'irrigation': df['irrigation'],
    'season': df['season']
})

# Encode season to numeric: rainy=1.0, transition=0.5, dry=0.0
season_map = {'rainy': 1.0, 'transition': 0.5, 'dry': 0.0}
X['season'] = X['season'].map(season_map).fillna(0.0)

# Target: normalize sick of malaria to 0-1 by dividing by max
y_raw = df['sick of malaria'].astype(float)
max_cases = y_raw.max() if y_raw.max() > 0 else 1.0
y = (y_raw / max_cases).values.astype(np.float32)

# Feature scaling
feature_cols = ['temperature','rainfall','humidity','breedingCount','previousCases','irrigation','season']
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X[feature_cols].values.astype(np.float32))

# Save scaler
with open('scaler.pkl', 'wb') as f:
    pickle.dump({'scaler': scaler, 'feature_cols': feature_cols, 'max_cases': max_cases}, f)

# Train/test split
X_train, X_val, y_train, y_val = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Convert to tensors
X_train_t = torch.tensor(X_train, dtype=torch.float32)
X_val_t = torch.tensor(X_val, dtype=torch.float32)
y_train_t = torch.tensor(y_train.reshape(-1,1), dtype=torch.float32)
y_val_t = torch.tensor(y_val.reshape(-1,1), dtype=torch.float32)

# Model
input_size = X_train_t.shape[1]
model = MalariaPredictor(input_size=input_size, hidden_size=32)
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.01)

# Training loop
epochs = 1000
best_val = float('inf')
patience = 100
wait = 0
for epoch in range(1, epochs+1):
    model.train()
    optimizer.zero_grad()
    preds = model(X_train_t)
    loss = criterion(preds, y_train_t)
    loss.backward()
    optimizer.step()

    model.eval()
    with torch.no_grad():
        val_preds = model(X_val_t)
        val_loss = criterion(val_preds, y_val_t)

    if epoch % 100 == 0 or epoch==1:
        print(f"Epoch {epoch}/{epochs} train_loss={loss.item():.6f} val_loss={val_loss.item():.6f}")

    # Early stopping
    if val_loss.item() < best_val - 1e-6:
        best_val = val_loss.item()
        wait = 0
        torch.save(model.state_dict(), 'malaria_model.pth')
    else:
        wait += 1
        if wait >= patience:
            print('Early stopping at epoch', epoch)
            break

# Final evaluation
model.load_state_dict(torch.load('malaria_model.pth'))
model.eval()
with torch.no_grad():
    all_preds = model(torch.tensor(X_scaled, dtype=torch.float32)).numpy().squeeze()
    all_preds_pct = all_preds * 100.0
    true_pct = y * 100.0

from sklearn.metrics import mean_squared_error, r2_score
mse = mean_squared_error(true_pct, all_preds_pct)
r2 = r2_score(true_pct, all_preds_pct)
print('Training complete. MSE (pct):', mse, 'R2:', r2)

# Save final model (already saved when improved)
print('Saved malaria_model.pth and scaler.pkl')
