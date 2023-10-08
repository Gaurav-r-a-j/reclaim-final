import React, { useEffect, useState } from "react";
import { SelectButton, SingleCard } from "../../components/Cards";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { editHeading } from "../../ClassNames";

const Found = () => {
  const [latestPosts, setLatesPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosInstance.get("/notes/getnotes");
        console.log(data);
        setLatesPosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts =
    selectedCategory === "All"
      ? latestPosts.filter((post) => post.tag === "found")
      : latestPosts.filter(
          (post) => post.campus === selectedCategory && post.tag === "found"
        );
  return (
    <>
      <div id="blog ">
        <div className="max-w-screen-xl m-auto pt-24 pb-20">
          <div className=" space-y-2 text-center">
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl dark:text-white">
              Found Articles
            </h2>

            <div className="w-full py-5">
              <SelectButton
                text={"All"}
                value={"All"}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
              <SelectButton
                text={"CU"}
                value={"cu"}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
              <SelectButton
                text={"CGC -J"}
                value={"jhanjeri"}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
              <SelectButton
                text={"CGC -L"}
                value={"landran"}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts?.length === 0 && (
              <div className="col-span-full text-center">
                <h3 className={editHeading}>Nothing Lost or Found</h3>{" "}
                <p>Bde Tez ho rahe ho</p>{" "}
              </div>
            )}

            {filteredPosts.map((post) => (
              <SingleCard
                key={post._id}
                image={post.image}
                title={post.title}
                tag={post.tag}
                campus={post.campus}
                text={post.text}
                place={post.place}
              />
            ))}
          </div>
        </div>
      </div>

      <FoundFixedButton />
    </>
  );
};

export const FoundFixedButton = () => {
  return (
    <Link
      to="/found-registration"
      type="button"
      className="fixed bottom-4 right-4 z-50 text-white bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-normal rounded-3xl md:text-lg text-sm px-6 py-2.5 text-center mr-2 mb-2 hover:scale-105 animate-bounce"
    >
      Register for Found Item
    </Link>
  );
};

export default Found;
