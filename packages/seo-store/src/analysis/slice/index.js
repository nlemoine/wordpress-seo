import { createSelector } from "@reduxjs/toolkit";
import { combineReducers } from "@wordpress/data";
import { editorSelectors } from "../../editor/slice";
import { formSelectors } from "../../form/slice";
import configReducer, { configActions, configSelectors } from "./config";
import resultsReducer, { resultsActions, resultsSelectors } from "./results";

export const ANALYSIS_SLICE_NAME = "analysis";

export const analysisSelectors = {
	...resultsSelectors,
	...configSelectors,
	selectPaper: createSelector(
		formSelectors.selectSeoTitle,
		formSelectors.selectMetaDescription,
		formSelectors.selectSlug,
		editorSelectors.selectPermalink,
		editorSelectors.selectContent,
		editorSelectors.selectDate,
		( seoTitle, metaDescription, slug, content, permalink, date ) => ( { seoTitle, metaDescription, slug, content, permalink, date } ),
	),
};

export const analysisActions = {
	...resultsActions,
	...configActions,
};

export default combineReducers( {
	config: configReducer,
	results: resultsReducer,
} );
