import { useNavigate } from "react-router";
import { Typography, Container } from "@pnkx-lib/ui";
import { useTranslation } from "react-i18next";
import PageNotFoundIcon from "@src/assets/icons/PageNotFoundIcon";

const Page404 = () => {
  //! State
  const router = useNavigate();
  const { t: trans } = useTranslation();
  //! Function
  const backToHome = () => {
    //trở về màn hình chính
    router("/");
  };
  //! Render
  return (
    <Container
      size="max-w-screen-xl"
      className="min-h-screen flex justify-center items-center"
    >
      <div className="flex flex-col md:flex-row items-end-safe md:space-y-0 md:space-x-4">
        <div className="text-center md:text-left">
          <Typography.Title className="text-xs" level={2}>
            {trans("pageNotFound:title")}
          </Typography.Title>
          <Typography.Paragraph className="min-w-fit text-gray-500 pb-15">
            {trans("pageNotFound:topDescription")}
            <br />
            {trans("pageNotFound:centerDescription")}
            <br />
            {trans("pageNotFound:bottomDescription")}
          </Typography.Paragraph>
          <div
            onClick={backToHome}
            className="bg-blue-500 text-white px-6 py-2 rounded-full cursor-pointer inline-block text-center hover:bg-blue-600 transition text-xs"
          >
            {trans("pageNotFound:backToHome")}
          </div>
        </div>
        <PageNotFoundIcon className="w-lg h-auto md:mt-0" />
      </div>
    </Container>
  );
};

export default Page404;
