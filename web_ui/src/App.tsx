import React, { useState, useEffect, useRef } from "react";
import { Route, useMatch, Routes } from "react-router-dom";

import ThemeProvider from "@components/ThemeProvider";
import AppBar from "@components/appbar";
import Preview from "@components/preview";
import DevConfig from "@components/dev";
import log from "loglevel";
import { useLocalStorageState, useSessionStorageState } from "ahooks";
import _ from "lodash";

const USER_TABS = {
  // config: Config,
  // preview: Preview,
  // calibration: CalibrationNavigator,
  // tviz: TViz,
};
const UPGRADE_TABS = {
  // upgrade: FileUploader,
};
const DEVELOPER_TABS = {
  configDev: DevConfig,
  // log: Log,
};

export default function App() {
  const [isDeveloperMode, setIsDeveloperMode] = useSessionStorageState("devMode", false);
  const [isDarkMode, setIsDarkMode] = useLocalStorageState("theme", false);
  const [menuBars, setMenuBar] = useState(<div />);
  const editorRef = useRef<any>();
  let url = useMatch("/:item");

  const userLinks =
    url?.pathname == "/editor" ? [] : _.concat("home", Object.keys(USER_TABS), Object.keys(UPGRADE_TABS));

  const developerLinks = url?.pathname == "/editor" ? [] : Object.keys(DEVELOPER_TABS);

  useEffect(() => {
    if (isDeveloperMode) log.enableAll();
    // change in render function won't do, why?
    else log.setLevel(log.levels.WARN); // default level
  }, [isDeveloperMode]);

  useEffect(() => {
    if (editorRef.current && url?.pathname == "/editor") {
      setMenuBar(editorRef.current.menuBar());
    } else {
      setMenuBar(<div />);
    }
  }, [editorRef, url]);


  return (
    <ThemeProvider isDarkMode={isDarkMode}>
      <AppBar
        {...{
          isDeveloperMode,
          setIsDeveloperMode,
          isDarkMode,
          setIsDarkMode,
          userLinks: userLinks,
          menuBars: menuBars,
          developerLinks: developerLinks,
        }}
      />
      <Routes>
        <Route path="/">
          <Route index element={<Preview />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
