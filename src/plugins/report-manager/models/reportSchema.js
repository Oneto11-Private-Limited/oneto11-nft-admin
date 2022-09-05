const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create a schema
var document = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		nftId: {
			type: String,
			required: true,
		},
		reason: {
			type: String,
			required: true,
		},
		comments: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			default: () => new Date(),
		},
		deleted: {
			type: Boolean,
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	},
);

module.exports = mongoose.model("Report", document, "reports");
