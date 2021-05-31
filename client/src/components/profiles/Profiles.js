import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Spinner from "../layout/Spinner";
import ProfileItem from "../profiles/ProfileItem";
import { getAllProfiles } from "../../actions/profile";

export const Profiles = ({ getAllProfiles, profile: { profiles, loading } }) => {
	useEffect(() => {
		getAllProfiles();
	}, [getAllProfiles]);

	return (
		<Fragment>
			{loading ? (
				<section className="container">
					<Spinner />
				</section>
			) : (
				<section className="container">
					<h1 className="large text-primary">Developers</h1>
					<p className="lead">
						<i className="fab fa-connectdevelop"></i> Browse and connect with developers
					</p>
					<div className="profiles">
						{profiles.length > 0 ? (
							profiles.map((profile) => (
								<ProfileItem key={profile._id} profile={profile} />
							))
						) : (
							<h4>No profiles found !</h4>
						)}
					</div>
				</section>
			)}
		</Fragment>
	);
};

Profiles.propTypes = {
	getAllProfiles: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
});

export default connect(mapStateToProps, { getAllProfiles })(Profiles);
