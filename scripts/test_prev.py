import sys
from pathlib import Path
# ensure project root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from malaria_model import predict_malaria_risk

prevs = [0,1,5,10,25,50,100,200]
for prev in prevs:
    r = predict_malaria_risk(20,28,33,75,5,prev)
    print(prev, r['probability'], r.get('predicted_cases'))
