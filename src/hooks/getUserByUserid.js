import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const useGetUserProfileById = (userId) => {
	const [isFetching, setIsFetching] = useState(true);
	const [userProfile, setUserProfile] = useState(null);
	

	useEffect(() => {
		const getUserProfile = async () => {
			setIsFetching(true);
			setUserProfile(null);

			try {
				const userRef = await getDoc(doc(db, 'users', userId));
				if (userRef.exists()) {
					setUserProfile(userRef.data());
				}
			} catch (error) {
				console.log(error);
			} finally {
				setIsFetching(false);
			}
		};

		getUserProfile();
	}, [setUserProfile, userId]);

	return { isFetching, userProfile, setUserProfile };
};

export default useGetUserProfileById;
