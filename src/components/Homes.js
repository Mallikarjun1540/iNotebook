
import Notes from "./Notes";

const Homes = (props) => {
  const {showAlert}=props;
  return (
    <div>
      
      <Notes showAlert={showAlert}/>
    </div>
  );
};

export default Homes;
