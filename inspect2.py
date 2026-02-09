import pandas as pd
from pathlib import Path
p=Path('data.xlsx')
print('Using header=None')
df=pd.read_excel(p, header=None)
print('Shape:', df.shape)
print(df.head(12).to_string(index=True, header=False))
