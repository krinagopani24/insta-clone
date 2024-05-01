import { useContext, useState } from 'react';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContext';
import { db } from '../firebase';

const usePostComment = (length) => {
	const [isCommenting, setIsCommenting] = useState(false);
  const [commentNumber, setCommentNumber] = useState(length || 0)
  const {currentUser} = useContext(AuthContext)

	const handlePostComment = async (postId, comment) => {
		if (isCommenting) return;
		setIsCommenting(true);

		const newComment = {
			comment,
			createdAt: Date.now(),
			createdBy: currentUser.uid,
		};

		try {
			await updateDoc(doc(db, 'posts', postId), {
				comments: arrayUnion(newComment),
			});
      setCommentNumber(commentNumber + 1)
		} catch (error) {
			console.log(error);
		} finally {
			setIsCommenting(false);
		}
	};

	return { isCommenting, handlePostComment,commentNumber };
};

export default usePostComment;
