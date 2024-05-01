import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import "@blueprintjs/core/lib/css/blueprint.css";
import { createStore } from "polotno/model/store";
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const store = createStore({
  key: "CRkXEv8YfmPQcyBgDj2j",
  showCredit: true,
});
// eslint-disable-next-line no-unused-vars
const page = store.addPage();

const PhotoEditor = () => {
  const boxRef = useRef(null);
  const [style, setStyle] = useState({
    height: "100px",
    width: "100px",
  });
  useEffect(() => {
    if (boxRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { contentRect } = entries[0];
        setStyle({ height: contentRect.height, width: contentRect.width });
      });
      resizeObserver.observe(boxRef.current);

      return () => resizeObserver.disconnect(); // Cleanup on unmount
    }
  }, [boxRef]);

  return (
    <Box ref={boxRef} sx={{ minHeight: "100%", minWidth: "100%" }}>
      <PolotnoContainer
        style={{
          height: `${style.height}px`,
          width: `${style.width}px`,
        }}
      >
        <SidePanelWrap>
          <SidePanel store={store} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} downloadButtonEnabled />
          <Workspace store={store} />
          <ZoomButtons store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </Box>
  );
};

export default PhotoEditor;
