import React, { useState, useEffect } from 'react';

const requestURL = 'http://localhost:7777/notes';
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
		update()
	});

	return (
		<div className={"main"}>
			<div className={"header"}>
				<h2>Notes</h2>
				<button className={"update"} onClick={() => update()}>Update</button>
			</div>
			{notes.map((element) => {
				return <div className={"external"} key={element.id}>
					<button className={"close"} onClick={() => handleRemove(element.id)}>X</button>
					<div className={"internal"}>{element.content}</div>
				</div>
			})
			}
			<form onSubmit={handleSubmit}>
				<div>
					<label className="form-label">New Note</label>
				</div>
				<div className="note-text">
					<textarea name={"story"} className="story"
						rows="5" cols="33" onChange={handleChange} value={form.story}>
					</textarea>
					<div>
						<input type={"submit"} className={"button"} value={"Add"} />
					</div>
				</div>
			</form>
		</div>
	)

}

export default ListNotes;
