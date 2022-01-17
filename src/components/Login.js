import { useEffect, useState } from "react";
const Login = () => {
  const [savedList, setSavedList] = useState(
    JSON.parse(localStorage.getItem("saved"))
  );
  const [savedPro, setSavedPro] = useState(
    JSON.parse(localStorage.getItem("savedPro"))
  );
  const [remember,setRemember] = useState(false);

  const [corpId, setCorpId] = useState();
  const [userId, setUserId] = useState();
  const [type, setType] = useState("firm");
  const types = ["firm", "proprietor"];
  const savedClickHandler = (c_id, u_id) => {
    console.log(c_id, u_id);
    setCorpId(c_id);
    setUserId(u_id);
    setType("firm");
    setRemember(true);
  };
  const savedProClickHandler = (u_id) => {
    console.log(u_id);
    setUserId(u_id);
    setType("proprietor");
    setRemember(true);
  };
  const onChangeHandler = ()=>{
      setRemember(!remember);
  }

  return (
    <div className="blackbox">
      <div className="leftPart">
        Saved Users
        <div>
          <table>
            {Object.keys(savedList).map((ele) => {
              return (
                <button
                  onClick={() =>
                    savedClickHandler(savedList[ele].c_id, savedList[ele].u_id)
                  }
                >
                  <tr>
                    <td rowSpan={2}>{savedList[ele].name}</td>
                    <td>{savedList[ele].c_id}</td>
                  </tr>
                  <tr>
                    <td>{savedList[ele].u_id}</td>
                  </tr>
                </button>
              );
            })}
            {Object.keys(savedPro).map((ele) => {
              return (
                <button
                  onClick={() => savedProClickHandler(savedPro[ele].u_id)}
                >
                  <tr>
                    <td>{savedPro[ele].name}</td>
                    <td>{savedPro[ele].u_id}</td>
                  </tr>
                </button>
              );
            })}
          </table>
        </div>
      </div>
      <div className="rightPart">
        Login
        <div>
          <form>
            <div>
              {types.map((t) => (
                <>
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={type === t}
                    onChange={(e) => setType(e.currentTarget.value)}
                  />{" "}
                  {t}
                </>
              ))}
              <p>{type}</p>
            </div>
            {type === "firm" && (
              <input
                type="text"
                name="cid"
                value={corpId}
                placeholder="Corporate ID"
              />
            )}
            <br />
            <input
              type="text"
              name="uid"
              value={userId}
              placeholder="User ID"
            />
            <br />
            <input
              type="password"
              name="password"
              value=""
              placeholder="Password"
            />
            <br />
            <input type="checkbox" checked={remember} onChange={onChangeHandler} name="remember" /> Remember me
            <p>Is "My Value" checked? {remember.toString()}</p>
            <input type="submit" className="btn-login" value="LOGIN" />
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
