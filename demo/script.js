import MagicalScroll from "https://cdn.skypack.dev/magical-scroll@1.0.3";

const magicalScroll = MagicalScroll.getInstance();

magicalScroll.addElement({
  target: "#title1",
  animations: {
    opacity: {
      positions: [0, "#screenHeight/2"],
      values: [1, 0],
    },
  },
});

magicalScroll.addElement({
  target: "#title2",
  animations: {
    translateX: {
      positions: ["#screenHeight/2+50", "#screenHeight"],
      values: [0, -50],
    },
  },
});

magicalScroll.addElement({
  target: "#titleS",
  animations: {
    opacity: {
      positions: ["#screenHeight+100", "#screenHeight+300"],
      values:[1, 0],
    },
    scale: {
      positions: ["#screenHeight", "#screenHeight+200"],
      values: [1, 100],
    },
  },
});

magicalScroll.addElement({
  target: "#titleCroll",
  animations: {
    opacity: {
      positions: ["#screenHeight", "#screenHeight+200"],
      values:[1, 0],
    },
  },
});

magicalScroll.addElement({
  target: "#bg2",
  animations: {
    backgroundColor: {
      positions: ["#screenHeight+200", "#screenHeight*2"],
      values: ["#27353A00", "#27353AFF"],
    },
  },
});

magicalScroll.addElement({
  target: "#npm",
  animations: {
    opacity: {
      positions: ["#screenHeight*2+50", "#screenHeight*2+250"],
      values: [0, 1],
    },
    translateY: {
      positions: ["#screenHeight*2+50", "#screenHeight*2+250"],
      values: [240, 0],
    },
  },
});

magicalScroll.addElement({
  target: "#demo",
  animations: {
    scale: {
      positions: ["#screenHeight*2+300", "#screenHeight*2+750"],
      values: [5, 1],
    },
    translateY: {
      positions: ["#screenHeight*2+300", "#screenHeight*2+750"],
      values: [150, 0],
    },
    backgroundColor: {
      positions: ["#screenHeight*2+300", "#screenHeight*2+750"],
      values: ['#ffffff1a', '#ffffffff'],
    },
    VideoColorSpace: {
      positions: ["#screenHeight*2+300", "#screenHeight*2+750"],
      values: ['#ffffffff', '#ffffff1a'],
    },
  },
});

magicalScroll.refresh();