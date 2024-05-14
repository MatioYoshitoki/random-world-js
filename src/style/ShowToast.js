export function SuccessToast(message, toast) {
    toast({
        title: '成功',
        position: 'top-right',
        description: message,
        status: 'success',
        duration: 1000,
        isClosable: true,
    })
}

export function FailedToast(message, toast) {
    toast({
        title: '失败',
        position: 'top-right',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
    })
}