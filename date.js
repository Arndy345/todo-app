exports.getdate = function () {
	let date = new Date();
	let options = {
		weekday: "long",
		day: "numeric",
		month: "long",
	};
	return date.toLocaleDateString(
		"en-us",
		options
	);
};

exports.getday = function () {
	let date = new Date();
	let options = {
		weekday: "long",
	};
	return date.toLocaleDateString(
		"en-us",
		options
	);
};
