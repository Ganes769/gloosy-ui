import { use } from "react";
import { getAllCreator } from "../services/api";
const promise = getAllCreator();
export default function Creator() {
  const creator = use(promise);
  console.log(creator);
  return <div>HELLO</div>;
}
