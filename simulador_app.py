import socket
import random
import time
from datetime import datetime

# Configuración del destino (la IP del sniffer y el puerto)
IP_SNIFER = "localhost"  # Si el sniffer está en el mismo PC
PUERTO = 59595

# Crear socket UDP
cliente = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# --- Configuración de la ruta ---
# Coordenadas aproximadas para iniciar en la Terminal de Transportes en Soledad
start_lat = 10.8200  
start_lon = -74.8000

# Coordenadas aproximadas de la Universidad del Norte
end_lat = 10.9800  
end_lon = -74.7800

# Número total de pasos para recorrer la ruta (ajusta según necesites)
total_steps = 60  
current_step = 0

try:
    while current_step <= total_steps:
        # Parámetro de interpolación (0 en el inicio, 1 en el final)
        t = current_step / total_steps

        # Interpolación lineal para simular movimiento en la ruta
        lat = start_lat + t * (end_lat - start_lat)
        lon = start_lon + t * (end_lon - start_lon)

        # Simula una velocidad real (por ejemplo, entre 20 y 60 km/h)
        velocidad = random.randint(20, 60)

        # Simula el consumo de gasolina:
        # Con t=0, gasolina = 100% y con t=1, gasolina = 0%
        gasolina = max(100 * (1 - t), 0)

        estampa = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        mensaje = f"{lat:.6f},{lon:.6f},{estampa},{velocidad},{gasolina:.2f}"

        print(f"DEBUG: Mensaje generado: '{mensaje}'")
        cliente.sendto(mensaje.encode('utf-8'), (IP_SNIFER, PUERTO))
        print(f"📤 Enviado: {mensaje}")

        current_step += 1
        time.sleep(5)  # Espera 5 segundos antes del siguiente envío

except KeyboardInterrupt:
    print("\n🛑 Transmisión detenida por el usuario.")

finally:
    cliente.close()