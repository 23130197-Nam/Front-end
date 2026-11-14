import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Dùng thay thế cho useDispatch thông thường
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Dùng thay thế cho useSelector thông thường
export const useAppSelector = useSelector.withTypes<RootState>();