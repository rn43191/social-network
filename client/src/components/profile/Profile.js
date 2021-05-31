import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExp from "./ProfileExp";
import ProfileEdu from "./ProfileEdu";
import ProfileGithub from "./ProfileGithub";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";

export const Profile = ({ match, getProfileById, profile: { profile, loading }, auth }) => {
	useEffect(() => {
		getProfileById(match.params.id);
	}, [getProfileById, match.params.id]);

	return (
		<Fragment>
			{profile === null || loading ? (
				<section className="container">
					<Spinner />
				</section>
			) : (
				<section className="container">
					<Link to="/profiles" className="btn btn-light">
						Back To Profiles
					</Link>
					{auth.isAuthenticated &&
						auth.loading === false &&
						auth.user._id === profile.user._id && (
							<Link to="/edit-profile" className="btn btn-dark">
								Edit Profile
							</Link>
						)}
					<div className="profile-grid my-1">
						<ProfileTop profile={profile} />
						<ProfileAbout profile={profile} />
						<div className="profile-exp bg-white p-2">
							<h2 className="text-primary">Experience</h2>
							{profile.experience.length > 0 ? (
								<Fragment>
									{profile.experience.map((exp) => (
										<ProfileExp key={exp._id} experience={exp} />
									))}
								</Fragment>
							) : (
								<h4>No experience credentials</h4>
							)}
						</div>
						<div className="profile-edu bg-white p-2">
							<h2 className="text-primary">Education</h2>
							{profile.education.length > 0 ? (
								<Fragment>
									{profile.education.map((edu) => (
										<ProfileEdu key={edu._id} education={edu} />
									))}
								</Fragment>
							) : (
								<h4>No Education credentials</h4>
							)}
						</div>
						{profile.githubusername && (
							<ProfileGithub username={profile.githubusername} />
						)}
					</div>
				</section>
			)}
		</Fragment>
	);
};

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
