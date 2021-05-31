import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Alert from "../layout/Alert";
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { getPost } from "../../actions/post";
import { Link } from "react-router-dom";

export const Post = ({ getPost, post: { post, loading }, match }) => {
	useEffect(() => {
		getPost(match.params.id);
	}, [getPost, match.params.id]);

	return loading || post === null ? (
		<section className="container">
			<Spinner />
		</section>
	) : (
		<Fragment>
			<section className="container">
				<Alert />
				<Link to="/posts" className="btn">
					Back To Posts
				</Link>
				<PostItem post={post} showActions={false} />
				<CommentForm postId={post._id} />
				<div className="comments">
					{post.comments.map((comment) => (
						<CommentItem key={comment._id} comment={comment} postId={post._id} />
					))}
				</div>
			</section>
		</Fragment>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
