import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Alert from "../layout/Alert";
import Spinner from "../layout/Spinner";
import PostItem from "./PostItem";
import Postform from "./PostForm";
import { getPosts } from "../../actions/post";

export const Posts = ({ getPosts, post: { posts, loading } }) => {
	useEffect(() => {
		getPosts();
	}, [getPosts]);

	return loading ? (
		<section className="container">
			<Spinner />
		</section>
	) : (
		<Fragment>
			<section className="container">
				<Alert />
				<h1 className="large text-primary">Posts</h1>
				<p className="lead">
					<i className="fas fa-user"></i> Welcome to the community
				</p>
				<Postform />
				<div className="posts">
					{posts.map((post) => (
						<PostItem key={post._id} post={post} />
					))}
				</div>
			</section>
		</Fragment>
	);
};

Posts.propTypes = {
	getPosts: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
