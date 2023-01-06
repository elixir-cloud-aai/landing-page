import React, { useContext, useState } from "react";
import Zoom from "react-reveal/Zoom";
import DarkModeContext from "../context/darkMode";

function Partners({ funders }) {
    const [query, setQuery] = useState("");
    const [filteredFunders, setFilteredFunders] = useState(funders);
    const darkMode = useContext(DarkModeContext);

    const handleSearch = (e) => {
        const term = e.target.value.trim().toLowerCase();
        setQuery(term);
        if (term === "") {
            setFilteredFunders(funders);
            return;
        }
        const newFilteredFunders = funders.filter((funder) => {
            return Object.values(funder).join(" ").toLowerCase().includes(term);
        });
        setFilteredFunders(newFilteredFunders);
    };

    const renderReciepients = (recipients) => {
        return recipients.map((recipient, i) => {
            return (
                <span key={recipient.id}>
                    {i !== 0 ? ", " : ""}
                    {recipient.name}
                </span>
            );
        });
    };

    const formatDate = (d) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(d);
        return date.toLocaleDateString("en-GB", options);
    };

    const renderFunders = () => {
        return filteredFunders?.map((funder) => {
            return (
                <Zoom key={funder.id}>
                    <a href={funder.website} target="_blank" rel="noopener noreferrer">
                        <div className="w-full rounded-lg border-2 shadow-lg hover:shadow-md my-5 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 cursor-pointer ">
                            <div className="flex md:flex-row flex-col">
                                <img
                                    src={!darkMode ? funder.icon : funder.iconDark}
                                    className={`md:rounded-l-lg md:rounded-t-none rounded-t-lg md:w-32 md:h-32 p-5 ${darkMode ? `darkMode` : ``
                                        }`}
                                    alt="Icon"
                                    width="auto"
                                    height="auto"
                                />
                                <div className="flex-grow p-5">
                                    <div className="text-xl font-semibold dark:text-gray-200">
                                        {funder.instrument}
                                    </div>
                                    <div className="text-base mt-1 text-gray-500">
                                        <span className="font-semibold">Project: </span>
                                        {funder.projectTitle}
                                    </div>
                                    <div className="text-base text-gray-500">
                                        <span className="font-semibold">Reciepients: </span>
                                        {renderReciepients(funder.recipients)}
                                    </div>
                                    <div className="text-base text-gray-500 flex flex-col md:flex-row md:gap-2">
                                        <span className="font-semibold">Duration: </span>
                                        {formatDate(funder.timeline.start) +
                                            " - " +
                                            formatDate(funder.timeline.end)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </Zoom>
            );
        });
    };

    return (
        <div className="mt-32 md:mx-64 mx-10 font-pop text-gray-700">
            <p className="md:text-xl sm:text-base text-sm mt-1 md:mt-0 dark:text-gray-200 font-bold text-center my-5">
                We would like to express our gratitude to our funders
            </p>
            <input
                className="md:text-base text-sm px-3 py-2 border-2 rounded-lg outline-none w-full focus:shadow-lg hover:shadow-lg mb-5 placeholder-opacity-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-900 dark:text-gray-200"
                placeholder="Search.."
                value={query}
                onChange={(e) => {
                    handleSearch(e);
                }}
            />
            {renderFunders()}
        </div>
    );
}

export default Partners;
