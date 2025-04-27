import socket
import random
import time
from datetime import datetime

# Configuración del destino (la IP del sniffer y el puerto)
IP_SNIFER = "localhost"  # Si el sniffer está en el mismo PC
PUERTO = 59595

# Crear socket UDP
cliente = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

try:
    while True:
        # Generar datos aleatorios
        lat = round(random.uniform(-90.0, 90.0), 6)
        lon = round(random.uniform(-180.0, 180.0), 6)
        estampa = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        velocidad= random.randint(1, 100)
        gasolina = random.randint(1, 100)


        # Crear paquete como string
        mensaje = f"{lat},{lon},{estampa},{velocidad},{gasolina}"

        # --- LÍNEA DE DEBUG ---
        print(f"DEBUG: Mensaje crudo generado: '{mensaje}'")
# --------------------


        # Enviar paquete al sniffer
        cliente.sendto(mensaje.encode('utf-8'), (IP_SNIFER, PUERTO))
        print(f"📤 Enviado: {mensaje}")

        time.sleep(5)  # Esperar 5 segundos antes del siguiente envío

except KeyboardInterrupt:
    print("\n🛑 Transmisión detenida por el usuario.")

finally:
    cliente.close()
