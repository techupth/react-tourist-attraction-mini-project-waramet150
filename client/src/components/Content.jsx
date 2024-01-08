import { useEffect, useState } from "react";
import axios from "axios";

function Content() {
  const [data, setData] = useState([]);
  console.log(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setSearchQuery(selectedTags.concat(tag).join(" "));
    }
  };

  const getData = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4001/trips?keywords=${searchQuery}`
      );
      setData(result.data.data);
    } catch (error) {
      // จัดการข้อผิดพลาด - เช่น แสดงข้อความแจ้งเตือนให้ผู้ใช้
      console.error("ไม่มีสถานที่ท่องเที่ยวที่ท่านเลือก", error);
    }
  };

  useEffect(() => {
    getData();
  }, [searchQuery]);

  const truncateData = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."; // ตัดข้อความที่ยาวเกินไปและเพิ่ม ...
    }
    return text;
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const copyToClipboard = (link) => navigator.clipboard.writeText(link);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-3/6">
        <p className="text-sm">ค้นหาที่เที่ยว</p>
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-center"
          placeholder="หาที่เที่ยวแล้วไปกัน ..."
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      {data.map((trip) => {
        return (
          <div
            className="product-list w-3/5 flex mt-3 font-sans"
            key={trip.eid}
          >
            <div className="">
              <img src={trip.photos[0]} className="h-44 w-64 rounded-xl m-4" />
            </div>
            <div className="trip-detail m-2">
              <a href={trip.url} target="blank">
                <h1 className="title text-2xl font-bold">{trip.title}</h1>
              </a>
              <p className="text-gray-400">
                {truncateData(trip.description, 100)}
              </p>
              <a
                href={trip.url}
                target="_blank"
                className="underline text-cyan-400"
              >
                อ่านต่อ
              </a>
              <div className="flex text-gray-400 ">
                หมวด
                {trip.tags.map((category, index) => (
                  <button
                    key={index}
                    className="ml-2 underline"
                    onClick={() => handleTagClick(category)}
                  >
                    {category}
                    {/* {index === trip.tags.length - 2 && <span> และ </span>} */}
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <div className="flex">
                  {trip.photos.slice(1).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      className="w-20 h-20 rounded-xl mr-5"
                      alt={`Photo ${index}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(trip.url)}
                  className="flex justify-end items-end w-16 h-16"
                >
                  <img
                    src="https://img.freepik.com/free-vector/illustration-share-icon_53876-5842.jpg?w=826&t=st=1704360133~exp=1704360733~hmac=1e3ab1f63ac6476a65db3095c1464c4a4cf0b3287d389206fdf3bb0962077c74"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Content;
