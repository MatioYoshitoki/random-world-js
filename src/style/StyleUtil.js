export function FishCardClassNameByStatus(status) {
    console.log('status='+status);
    if (status === 0) {
        return 'alive-fish';
    }
    return 'not-alive-fish';
}