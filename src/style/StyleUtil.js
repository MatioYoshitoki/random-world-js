export function FishCardClassNameByStatus(status) {
    if (status === 0) {
        return 'alive-fish';
    }
    return 'not-alive-fish';
}