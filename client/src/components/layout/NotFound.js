import React, { Fragment } from "react";

const NotFound = () => {
	return (
		<Fragment>
			<section className="container">
				<h1 className="x-large text-primary">
					<i className="fas fa-exclamation-triangle"></i> PAGE NOT FOUND !
				</h1>
				<p className="large">Sorry, This page does not exists.</p>
			</section>
		</Fragment>
	);
};

export default NotFound;
