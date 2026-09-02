import pandas as pd
from tratar_arquivo import tratar_csv_alunos

# Teste com o arquivo CSV
arquivo = "Membros da Wolf Finance  - Visão Geral.csv"

try:
    df = tratar_csv_alunos(arquivo)
    
    print("\n" + "="*80)
    print("✓ CSV TRATADO COM SUCESSO")
    print("="*80)
    
    print(f"\nTotal de registros: {len(df)}")
    print(f"\nColunas encontradas: {list(df.columns)}")
    
    print(f"\n{'='*80}")
    print("PRIMEIROS 3 REGISTROS:")
    print("="*80)
    print(df.head(3).to_string())
    
    print(f"\n{'='*80}")
    print("VERIFICAÇÃO DE VALORES FALTANTES:")
    print("="*80)
    print(df.isnull().sum())
    
    print(f"\n{'='*80}")
    print("TIPOS DE DADOS:")
    print("="*80)
    print(df.dtypes)
    
except Exception as e:
    print(f"\n✗ ERRO AO TRATAR CSV:")
    print(f"  {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
