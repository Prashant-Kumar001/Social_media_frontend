// hooks/reduxHooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

// 👇 Typed dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 👇 Typed selector
export const useAppSelector = useSelector.withTypes<RootState>();
