import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

const requestURL = 'http://localhost:7070/notes';
const headers = {
	'Content-Type': 'application/json'
}

function ListNotes() {
	const [notes, setNotes] = useState([]);
	const [form, setForm] = useState({ story: '' });

	const handleChange = evt => {
		const { name, value } = evt.target;
		setForm(prevForm => ({ ...prevForm, [name]: value }));
	};

	const handleRemove = async id => {
		const url = requestURL + `/${id}`;
		await fetch(url, { method: 'DELETE' });
		await update();
	};

	const update = async () => {
		const data = await fetch(requestURL, { method: 'GET' }).then(response => {
			return response.json();
		});
		setNotes(() => {
			return data;
		})
	}

	const handleSubmit = async evt => {
		evt.preventDefault();
		if (!form.story) return;
		const body = {
			"id": 0,
			"content": form.story
		}
		await fetch(requestURL, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: headers
		});
		setForm({ story: '' });
		await update();
	};

    useEffect(() => {
		update();
	}, [notes]);

	return (
		<>
			<div className={'header'}>
				<h2 className='header-h2'>Notes</h2>
				<button className={'main-btn-update'} onClick={() => update()}><FontAwesomeIcon icon={icon({name: 'sync'})} /></button>
			</div>
			
			<div className='desk'>
				{notes.map((element) => {
					return <div className={"external"} key={element.id}>
							<button className={"main-btn-close"} onClick={() => handleRemove(element.id)}>
								<FontAwesomeIcon icon={icon({name: 'xmark'})} />
							</button>
							<p className={"internal"}>{element.content}</p>
						</div>
					})
				}
			</div>
			
			<form className='form' onSubmit={handleSubmit}>
				<label className="form-label">New Note</label>
				<div className="note-text">
					<textarea name={"story"} className="story"
						rows="5" cols="33" onChange={handleChange} value={form.story}>
					</textarea>
					<div className='form-block'>
						<button className={"form-btn"}><FontAwesomeIcon icon={icon({name: 'angle-double-right'})} /></button>
					</div>
				</div>
			</form>
		</>
	)

}

export default ListNotes;
