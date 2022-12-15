import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditPhoto = () => {
	const [imageUrl, setImageUrl] = useState('');
	const [captions, setCaptions] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { id } = useParams();

	const editPhoto = (e) => {
		e.preventDefault();
		setLoading(true);
		fetch(`http://localhost:3001/photos/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				imageUrl,
				captions,
				updatedAt: new Date().toISOString(),
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					setError(data.error);
				} else {
					navigate('/photos');
				}
			});
	};

	useEffect(() => {
		setLoading(true);
		fetch(`http://localhost:3001/photos/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setImageUrl(data.imageUrl);
				setCaptions(data.captions);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [id]);

	if (error)
		return (
			<h1
				style={{
					width: '100%',
					textAlign: 'center',
					marginTop: '20px',
				}}>
				{error}
			</h1>
		);

	return (
		<>
			{loading ? (
				<h1
					style={{
						width: '100%',
						textAlign: 'center',
						marginTop: '20px',
					}}>
					Loading...
				</h1>
			) : (
				<div className='container'>
					<form className='edit-form' onSubmit={editPhoto}>
						<label>
							Image Url:
							<input
								className='edit-input'
								type='text'
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
							/>
						</label>
						<label>
							Captions:
							<input
								className='edit-input'
								type='text'
								value={captions}
								data-testid='captions'
								onChange={(e) => setCaptions(e.target.value)}
							/>
						</label>
						<input
							className='submit-btn'
							type='submit'
							value='Submit'
							data-testid='submit'
						/>
					</form>
				</div>
			)}
		</>
	);
};

export default EditPhoto;
