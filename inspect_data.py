import pandas as pd
from pathlib import Path
p = Path('data.xlsx')
print('Path:', p.resolve())
if not p.exists():
    print('data.xlsx not found')
else:
    df = pd.read_excel(p)
    print('Rows:', len(df))
    print('Columns:', list(df.columns))
    print('\nDTypes:')
    print(df.dtypes)
    print('\nSample:')
    print(df.head(10).to_string(index=False))
