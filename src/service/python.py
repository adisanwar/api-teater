import numpy as np
import math
import json

# Membaca data dari JSON file
import os
file_path = os.path.join(os.path.dirname(__file__), 'shuffledTickets.json')

with open(file_path, 'r') as f:
    shuffled_tickets = json.load(f)

# Mengambil hanya ID dari tiket yang di-shuffle
ticket_ids = [ticket['ticketId'] for ticket in shuffled_tickets]

# Data yang diberikan: urutan angka-angka tertentu
data_given = ticket_ids

# 1. Pengaturan Data
n = 20   # Total data 
n1 = 10  # Jumlah nilai 1 (representasi dari 1 hingga 10)
n2 = n - n1  # Jumlah nilai 0 (representasi dari 11 hingga 20)

# Ubah angka dari 1 hingga 10 menjadi 1, dan dari 11 hingga 20 menjadi 0
binary_data = np.array([1 if x <= 10 else 0 for x in data_given])

# Menghitung Jumlah Runs (R)
def count_runs(sequence):
    runs = 1  # Memulai dengan run pertama
    for i in range(1, len(sequence)):
        if sequence[i] != sequence[i - 1]:
            runs += 1
    return runs

# Menghitung Ekspektasi Runs (\(\mu_R\)) dan Standar Deviasi (\(\sigma_R\))
runs_count = count_runs(binary_data)
mu_R = (2 * n1 * n2) / (n1 + n2) + 1
sigma_R = np.sqrt((2 * n1 * n2 * (2 * n1 * n2 - n1 - n2)) / ((n1 + n2) ** 2 * (n1 + n2 - 1)))

# Menghitung Gap
gap = runs_count - mu_R

# Menghitung Z-Index
Z = gap / sigma_R

# Menghitung Permutasi Unik
permutations_unique = math.factorial(n) / (math.factorial(n1) * math.factorial(n2))

# Hasil
result = {
    "original_data": data_given,
    "binary_data": binary_data.tolist(),  # Konversi data biner ke bentuk list
    "runs_count": runs_count,
    "mu_R": mu_R,
    "sigma_R": sigma_R,
    "gap": gap,
    "Z": Z,
    "permutations_unique": permutations_unique
}

# Tulis hasil ke stdout dalam format JSON
import json
print(json.dumps(result, indent=2))
