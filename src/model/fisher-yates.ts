export function fisherYatesShuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    // Selama masih ada elemen yang akan diacak
    while (currentIndex !== 0) {

        // Pilih elemen yang tersisa
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Dan tukar dengan elemen saat ini
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}