import numpy as np
import math
import json

# Membaca data dari JSON file
with open('shuffledTickets.json', 'r') as f:
    shuffled_tickets = json.load(f)

# Ubah data ke format yang diperlukan
n = len(shuffled_tickets)
n1 = sum(1 for ticket in shuffled_tickets if ticket['status'] == 'win')
n2 = n - n1

# Generate data awal (n1 nilai 1 dan n2 nilai 0)
data = np.array([1] * n1 + [0] * n2)

# Pengacakan menggunakan Algoritma Fisher-Yates Shuffle
np.random.seed(42)
for i in range(len(data) - 1, 0, -1):
    j = np.random.randint(0, i + 1)
    data[i], data[j] = data[j], data[i]

# Menghitung Jumlah Runs (R)
def count_runs(sequence):
    runs = 1  # Memulai dengan run pertama
    for i in range(1, len(sequence)):
        if sequence[i] != sequence[i - 1]:
            runs += 1
    return runs

runs_count = count_runs(data)

# Menghitung Ekspektasi Runs (\(\mu_R\)) dan Standar Deviasi (\(\sigma_R\))
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
    "runs_count": runs_count,
    "mu_R": mu_R,
    "sigma_R": sigma_R,
    "gap": gap,
    "Z": Z,
    "permutations_unique": permutations_unique
}

# Tulis hasil ke stdout dalam format JSON
print(json.dumps(result))
