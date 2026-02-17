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

# load climate data from spreadsheet and select relevant columns
# assume file has columns 'avg temp', 'humidity (%)', 'rainy days', and
# 'sick of malaria' for the target.
df = pd.read_excel(p, header=1)
# drop rows with no data
df = df.dropna(how='all')

if 'sick of malaria' not in df.columns:
    raise ValueError("Spreadsheet must contain 'sick of malaria' column")

# derive feature matrix with climate inputs and previous cases
# note: dataset does not contain an explicit previous-month column, so we
# create it by shifting the target values (lag-1). users supplying live
# values to the API will provide their own previousCases number.
X = pd.DataFrame({
    'temperature': pd.to_numeric(df.get('avg temp'), errors='coerce'),
    'humidity': pd.to_numeric(df.get('humidity (%)'), errors='coerce'),
    'rainy_days': pd.to_numeric(df.get('rainy days'), errors='coerce'),
})
# placeholder for previous cases created later once y_raw is known

# fill missing climate values with column median
for c in ['temperature','humidity','rainy_days']:
    if X[c].isna().any():
        X[c] = X[c].fillna(X[c].median())

# target y
y_raw = pd.to_numeric(df['sick of malaria'], errors='coerce').fillna(0.0).astype(float)
max_cases = y_raw.max() if y_raw.max() > 0 else 1.0
# normalize y to 0-1
y = (y_raw / max_cases).values.astype(np.float32)

# create previous_cases column by shifting the raw target; fill first value with 0
prev_cases = y_raw.shift(1).fillna(0.0)
X['previous_cases'] = prev_cases.values

feature_cols = ['temperature','humidity','rainy_days','previous_cases']

# scale features using sklearn scaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X[feature_cols].values.astype(np.float32))

# Save scaler and metadata (including feature order)
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
