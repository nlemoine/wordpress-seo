import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { SEO_STORE_NAME, useAnalyze } from "@yoast/seo-store";
import { debounce } from "lodash";
import "./app.css";

const useDebounce = ( callback, dependencies, debounceTimeInMs = 500 ) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useCallback( debounce( callback, debounceTimeInMs ), [ callback, ...dependencies, debounceTimeInMs ] );
};

// Include analysis worker in analyzer?
// Send accessor type with analyze requests next to paper, how to handle?
// Add wrapper around these packages that exports a magic createYoastSeoIntegration function
// First candidate classic editor with WooCommerce

const Editor = () => {
	const { updateContent, updateTitle, updatePermalink, updateExcerpt, updateDate, updateFeaturedImage } = useDispatch( SEO_STORE_NAME );

	const handleContentChange = useDebounce( event => updateContent( event.target.value ), [ updateContent ] );
	const handleTitleChange = useDebounce( event => updateTitle( event.target.value ), [ updateTitle ] );
	const handlePermalinkChange = useDebounce( event => updatePermalink( event.target.value ), [ updatePermalink ] );
	const handleExcerptChange = useDebounce( event => updateExcerpt( event.target.value ), [ updateExcerpt ] );
	const handleDateChange = useDebounce( event => updateDate( event.target.value ), [ updateDate ] );
	const handleFeaturedImageChange = useDebounce( event => updateFeaturedImage( { url: event.target.value } ), [ updateFeaturedImage ] );

	return (
		<main className="editor inline-flex flex-column">
			<h1>Editor</h1>
			<label htmlFor="editor-title">Title</label>
			<div className="inline-flex">
				<input id="editor-title" name="title" onChange={ handleTitleChange } />
			</div>
			<label htmlFor="editor-content">Content</label>
			<textarea id="editor-content" name="content" rows="16" onChange={ handleContentChange } />
			<label htmlFor="editor-permalink">Permalink</label>
			<div className="inline-flex">
				<input id="editor-permalink" name="permalink" type="url" pattern="https?://.*" onChange={ handlePermalinkChange } />
				<span className="validity" />
			</div>
			<label htmlFor="editor-excerpt">Excerpt</label>
			<textarea id="editor-excerpt" name="excerpt" rows="3" onChange={ handleExcerptChange } />
			<label htmlFor="editor-date">Date</label>
			<div className="inline-flex">
				<input id="editor-date" name="date" type="datetime-local" onChange={ handleDateChange } />
				<span className="validity" />
			</div>
			<label htmlFor="editor-featured-image">Featured image URL</label>
			<div className="inline-flex">
				<input id="editor-featured-image" name="featured-image" type="url" pattern="https?://.*" onChange={ handleFeaturedImageChange } />
				<span className="validity" />
			</div>
		</main>
	);
};

const Keyphrases = () => {
	const ids = useSelect( select => select( SEO_STORE_NAME ).selectKeyphraseIds() );
	const { addKeyphraseEntry } = useDispatch( SEO_STORE_NAME );
	const handleAddKeyphraseEntry = useCallback( () => {
		addKeyphraseEntry();
	}, [ addKeyphraseEntry ] );

	return (
		<div className="inline-flex flex-column">
			{ ids.map( id => <Keyphrase key={ `keyphrase-entry-${ id }` } id={ id } /> ) }
			<button onClick={ handleAddKeyphraseEntry }>Add keyphrase</button>
		</div>
	);
};

const Keyphrase = ( props ) => {
	const initialKeyphrase = useSelect( select => select( SEO_STORE_NAME ).selectKeyphrase( props.id ) );
	const initialSynonyms = useSelect( select => select( SEO_STORE_NAME ).selectSynonyms( props.id ) );
	const { updateKeyphrase, updateSynonyms } = useDispatch( SEO_STORE_NAME );

	const handleKeyphraseChange = useDebounce( ( event ) => {
		updateKeyphrase( { id: props.id, keyphrase: event.target.value } );
	}, [ props.id, updateKeyphrase ] );
	const handleSynonymsChange = useDebounce( ( event ) => {
		updateSynonyms( { id: props.id, synonyms: event.target.value } );
	}, [ props.id, updateSynonyms ] );

	return (
		<fieldset className="inline-flex flex-column">
			<label htmlFor={ `keyphrase-${ props.id }` }>
				{ props.id === "focus" ? "Focus keyphrase" : "Related keyphrase" }
			</label>
			<input
				id={ `keyphrase-${ props.id }` }
				name={ `keyphrase-${ props.id }` }
				onChange={ handleKeyphraseChange }
				defaultValue={ initialKeyphrase }
			/>
			<label htmlFor={ `synonyms-${ props.id }` }>Synonyms</label>
			<input
				id={ `synonyms-${ props.id }` }
				name={ `synonyms-${ props.id }` }
				onChange={ handleSynonymsChange }
				defaultValue={ initialSynonyms }
			/>
		</fieldset>
	);
};

function App() {
	useAnalyze();

	return (
		<>
			<Editor />
			<aside className="sidebar">
				<h2>Sidebar</h2>
				<Keyphrases />
				<h4>SEO Results</h4>
				<div>...</div>
				<h4>Readability Results</h4>
				<div>...</div>
				<h4>Research Results</h4>
				<div>...</div>
			</aside>
		</>
	);
}

export default App;
