export function getFromEnv(key: string, defaultValue?: string) {
    const value = process.env[key]
    if (value === undefined) {
        if (defaultValue === undefined) {
            throw new Error(`env ${key} is not defined`)
        }
        return defaultValue
    }
    return value
}
