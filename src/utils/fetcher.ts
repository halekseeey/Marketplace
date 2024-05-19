class CustomError {
    message?: string;
    status?: number

    constructor(status?: number, message?: string) {
        this.message = message
        this.status = status
    }
}

export function fetcher(url: string, init?: RequestInit) {
    return fetch(url, init).then((res) => {
        if (res.ok) {
            return res.json()
        }

        throw new CustomError(res.status, res.statusText)
    })
}