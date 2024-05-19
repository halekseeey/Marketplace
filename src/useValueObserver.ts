import {ObservableValue} from './utils/ObservableValue';
import {useEffect} from 'react';


export function useValueObserver<T>(fn: (value?: T) => void, observableValue: ObservableValue<T>) {
    useEffect(() => {
        observableValue.addObserver(fn)

        return () => {
            observableValue.removeObserver(fn)
        }
    }, [observableValue, fn])
}