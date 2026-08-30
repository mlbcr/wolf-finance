from utils.fuso import agora, hoje

momento = agora()

print("================================")
print("AGORA:", momento)
print("DATA:", momento.date())
print("HORA:", momento.time())
print("================================")