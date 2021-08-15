import { SubmitHandler, useForm } from "react-hook-form";
import { Labels } from "../utils/helper";
import { convertXml } from "../services/convertXml";

interface IFormInput {
	xmlInput: string;
}

const XMLInputForm = () => {
	const { register, handleSubmit } = useForm<IFormInput>();
	const onSubmit: SubmitHandler<IFormInput> = (data) =>
		convertXml(data.xmlInput);
	return (
		<div className="m-2 p-2">
			<form onSubmit={handleSubmit(onSubmit)}>
				<label>{Labels.xmlLabel}</label>
				<div>
					<textarea
						{...register("xmlInput")}
						className="mt-2 h-28 w-9/12 outline-black"
					/>
				</div>
				<input type="submit" />
			</form>
		</div>
	);
};

export default XMLInputForm;
