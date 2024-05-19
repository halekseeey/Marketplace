type Observer<T> = (value: T) => void

export class ObservableValue<T> {
    protected _value: T
    private _observers: Observer<T>[] = []

    constructor(initValue: T) {
        this._value = initValue
    }

    setValue(value: T) {
        this._value = value
        this.emitObservers()
    }

    get value() {
        return this._value
    }

    emitObservers() {
        this._observers.forEach(observer => observer(this._value))
    }

    addObserver(fn: Observer<T>) {
        this._observers.push(fn)
    }

    removeObserver(fn: Observer<T>) {
        const index = this._observers.indexOf(fn)

        if (index) {
            this._observers.splice(index, 1)
        }
    }
}