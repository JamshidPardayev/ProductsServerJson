import { Button } from "antd";

const Header = () => {
  return (
    <div className="shadow-xl">
      <div className=" max-w-[1200px] justify-between mx-auto h-[100px] px-3 flex items-center gap-3">
        <img src="../../public/logo.png" alt="logo" className="h-[100px] w-[200px]"/>
        <Button type="primary">SEE PRODUCTS</Button>
      </div>
    </div>
  );
};

export default Header;
