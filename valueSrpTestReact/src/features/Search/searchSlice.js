import { createSlice } from "@reduxjs/toolkit";
const initialState = {searchText:null,searchResult:null}
const SearchSlice = createSlice({
    name: "search",
    initialState,
    reducers:{
        setResult : (state,action)=>{
            state.searchText = action.payload.searchText;
            state.searchResult = action.payload.searchResult;
        }
    }
});

export const { setResult } = SearchSlice.actions;
export default SearchSlice.reducer;