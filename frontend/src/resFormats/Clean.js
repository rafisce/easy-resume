import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";

import jsPDF from "jspdf";
import app from "../fire";
import { addOswald } from "../fonts/Oswald-Regular-normal";
import { addSourceSansPro } from "../fonts/SourceSansPro-normal";

const img = new Image();

export const cleanRes = async (userId, docId) => {
  const pos = {
    xRight: 203,
    xLeft: 100,
    lastYRight: 120,
    lastYleft: 120,
  };
  const tempTime = {
    on: false,
    last: 0,
  };
  const resume = await getRes(userId, docId);
  const doc = new jsPDF("p", "pt", "a4");
  const pageHeight =
    doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  addOswald();
  doc.setFont("Oswald-Regular", "normal");
  doc.setFontSize(20.8);
  doc.setCharSpace(2);

  const fullname = resume.user.first_name + " " + resume.user.last_name;
  doc.text(fullname.toUpperCase(), pageWidth / 2, pageHeight - 783, {
    align: "center",
  });

  doc.setCharSpace(0);
  addSourceSansPro();
  doc.setFont("SourceSansPro", "normal");
  doc.setFontSize(8);
  const job = resume.user.job ? resume.user.job : "";
  const phone = resume.user.phone ? resume.user.phone : "";

  const jobPhone = job + "            " + phone;

  doc.text(jobPhone.toUpperCase(), pageWidth / 2 - 2, pageHeight - 763, {
    align: "center",
  });

  const dim_all = doc.getTextDimensions(jobPhone.toUpperCase());

  const w_phone = doc.getTextWidth(phone.toUpperCase());

  const end = pageWidth / 2 + dim_all.w / 2 - 2;

  img.src = "/images/phone.png";
  if (resume.user.phone) {
    doc.addImage(
      "/images/phone.png",
      "PNG",
      end - w_phone - 8.1,
      pageHeight - 763 - dim_all.h * 0.68,
      dim_all.h * 0.8,
      dim_all.h * 0.8
    );
  }

  printProfile(pos, tempTime, resume, doc);
  printEducation(pos, tempTime, resume, doc);
  printJobs(pos, tempTime, resume, doc);
  printCustom(pos, tempTime, resume, doc);
  printDetails(pos, tempTime, resume, doc);
  printSkills(pos, tempTime, resume, doc);
  printLinks(pos, tempTime, resume, doc);

  console.log(
    "====================== resume creation done ======================"
  );
  // doc.save("Generated.pdf");
  return doc.output("blob");
};

export const getRes = async (userId, docId) => {
  const db = getFirestore(app);
  const jobs = [];
  const links = [];
  const education = [];
  const skills = [];
  const customs = [];
  const res = {};
  try {
    const querySnapshot = await getDocs(
      collection(db, `Users/${userId}/Documents/${docId}/Jobs`)
    );
    querySnapshot.forEach((doc) => {
      jobs.push(doc.data());
    });
    const querySnapshot2 = await getDocs(
      collection(db, `Users/${userId}/Documents/${docId}/Education`)
    );
    querySnapshot2.forEach((doc) => {
      education.push(doc.data());
    });
    const querySnapshot3 = await getDocs(
      collection(db, `Users/${userId}/Documents/${docId}/Skills`)
    );
    querySnapshot3.forEach((doc) => {
      skills.push(doc.data());
    });
    const querySnapshot4 = await getDocs(
      collection(db, `Users/${userId}/Documents/${docId}/Links`)
    );
    querySnapshot4.forEach((doc) => {
      links.push(doc.data());
    });
    const querySnapshot5 = await getDocs(
      collection(db, `Users/${userId}/Documents/${docId}/Customs`)
    );
    querySnapshot5.forEach(async (doc) => {
      const custom = doc.data();
      const querySnapshot5b = await getDocs(
        collection(
          db,
          `Users/${userId}/Documents/${docId}/Customs/${doc.id}/customItems`
        )
      );

      const customItems = [];
      querySnapshot5b.forEach((docb) => {
        customItems.push(docb.data());
      });
      custom.customItems = customItems;
      customs.push(custom);
    });

    const docRef = doc(db, `Users/${userId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.user = docSnap.data();
    }
  } catch (err) {
    console.log("some error occure");
  }

  res.jobs = jobs;
  res.skills = skills;
  res.education = education;
  res.links = links;
  res.customs = customs;

  return res;
};

export const freshPdf = () => {
  const doc = new jsPDF("p", "pt", "a4");
  return doc.output("blob");
};

const printProfile = (pos, tempTime, resume, doc) => {
  if (resume.user.profile) {
    img.src = "/images/profile.png";
    doc.addImage("/images/profile.png", "PNG", 180, 112, 9.5, 9.5);
    doc.setFont("Oswald-Regular", "normal").setFontSize(9);
    doc.setCharSpace(1);
    doc.text(pos.xRight, pos.lastYRight, "PROFILE");
    doc.setCharSpace(0);
    doc.setFont("SourceSansPro", "normal");
    doc.setFontSize(9).setLineHeightFactor(1.5);

    const profileText = doc.splitTextToSize(
      getBlockText(resume.user.profile.blocks),
      330
    );

    pos.lastYRight += 20;
    timelinePar(pos.xRight, pos.lastYRight, 1.6, profileText, 18, 1, doc, pos);
  }
};

const printEducation = (pos, tempTime, resume, doc) => {
  if (resume.education.length !== 0) {
    img.src = "/images/education.png";

    doc.addImage(
      "/images/education.png",
      "PNG",
      178.5,
      pos.lastYRight + 10,
      13,
      13
    );
    doc.setFont("Oswald-Regular", "normal").setFontSize(9);
    pos.lastYRight += 19.5;
    doc.setCharSpace(1);
    doc.text(pos.xRight, pos.lastYRight, "EDUCATION");

    const sorted = resume.education.sort(
      (a, b) => new Date(a.finish) - new Date(b.finish)
    );

    sorted.forEach((edu) => {
      doc.setCharSpace(0);

      doc.setFontSize(9).setLineHeightFactor(1.5);
      pos.lastYRight += 20;
      const educationText = [
        doc.splitTextToSize(edu.diploma + ", " + edu.institution, 330),
        doc.splitTextToSize(getBlockText(edu.description.blocks), 330),
        doc.splitTextToSize(
          edu.start.substr(0, 4) + " - " + edu.finish.substr(0, 4),
          330
        ),
      ];

      timeLineYear(
        1.6,
        educationText,
        18,
        1,
        doc,
        "SourceSansPro",
        "normal",
        pos,
        tempTime
      );
    });

    pos.lastYRight += 15;
    tempTime.on = false;
  }
};

const printJobs = (pos, tempTime, resume, doc) => {
  if (resume.jobs.length !== 0) {
    img.src = "/images/job.png";
    doc.addImage("/images/job.png", "PNG", 175, pos.lastYRight + 4.5, 21, 21);
    doc.setFont("Oswald-Regular", "normal").setFontSize(9);
    pos.lastYRight += 19.5;
    doc.setCharSpace(1);
    doc.text(pos.xRight, pos.lastYRight, "JOB EXPERIENCE");

    const sorted = resume.jobs.sort(
      (a, b) => new Date(a.finish) - new Date(b.finish)
    );

    sorted.forEach((job) => {
      doc.setCharSpace(0);
      pos.lastYRight += 20;
      const jobText = [
        doc.splitTextToSize(job.job + " at " + job.employer, 330),
        doc.splitTextToSize(getBlockText(job.description.blocks), 330),
        doc.splitTextToSize(
          job.start.substr(0, 4) + " - " + job.finish.substr(0, 4),
          330
        ),
      ];

      timeLineYear(
        1.6,
        jobText,
        18,
        1,
        doc,
        "SourceSansPro",
        "normal",
        pos,
        tempTime
      );
    });

    pos.lastYRight += 15;
    tempTime.on = false;
  }
};

const printCustom = (pos, tempTime, resume, doc) => {
  resume.customs.forEach((custom) => {
    img.src = "/images/custom.png";
    doc.addImage("/images/custom.png", "PNG", 179, pos.lastYRight + 9, 12, 12);
    doc.setFont("Oswald-Regular", "normal").setFontSize(9);
    pos.lastYRight += 19.5;
    doc.setCharSpace(1);
    doc.text(pos.xRight, pos.lastYRight, custom.title.toUpperCase());

    custom.customItems.forEach((item) => {
      doc.setCharSpace(0);
      pos.lastYRight += 20;
      const itemText = [
        doc.splitTextToSize(item.title, 330),
        doc.splitTextToSize(getBlockText(item.description.blocks), 330),
        doc.splitTextToSize(
          item.start.substr(0, 4) + " - " + item.finish.substr(0, 4),
          330
        ),
      ];

      timeLineYear(
        1.6,
        itemText,
        18,
        1,
        doc,
        "SourceSansPro",
        "normal",
        pos,
        tempTime
      );
    });

    pos.lastYRight += 15;
    tempTime.on = false;
  });
};

const printLinks = (pos, tempTime, resume, doc) => {
  if (resume.links.length !== 0) {
    img.src = "/images/links.png";

    doc.addImage(
      "/images/links.png",
      "PNG",
      178.5,
      pos.lastYRight + 10,
      12,
      12
    );
    doc.setFont("Oswald-Regular", "normal").setFontSize(9);
    pos.lastYRight += 19.5;
    doc.setCharSpace(1);
    doc.text(pos.xRight, pos.lastYRight, "LINKS");

    const sorted = resume.links.sort((a, b) => a.name.localeCompare(b.name));

    sorted.forEach((link) => {
      doc.setCharSpace(0);
      doc.setFont("SourceSansPro", "normal");
      doc.setFontSize(11).setLineHeightFactor(1.5);
      pos.lastYRight += 20;
      const linkText = [
        doc.splitTextToSize(link.name, 330),
        doc.splitTextToSize(link.link, 330),
      ];

      timelineMul(
        1.6,
        linkText,
        18,
        1,
        doc,
        "SourceSansPro",
        "normal",
        pos,
        tempTime
      );
    });
    pos.lastYRight += 15;
    tempTime.on = false;
  }
};

const printDetails = (pos, tempTime, resume, doc) => {
  if (resume.user.phone || resume.user.email) {
    doc.setFont("Oswald-Regular", "normal").setFontSize(9);
    doc.setCharSpace(1);
    circledHeader(1.6, "DETAILS", 1, doc, pos);
    doc.setCharSpace(0.5);
    doc.setFont("SourceSansPro", "normal");
    doc.setFontSize(9).setLineHeightFactor(1.5);
    pos.lastYleft += 20;
    doc.text(resume.user.phone, pos.xLeft, pos.lastYleft, {
      align: "center",
    });
    pos.lastYleft += 14;
    doc.text(resume.user.email, pos.xLeft, pos.lastYleft, {
      align: "center",
    });
  }
};

const printSkills = (pos, tempTime, resume, doc) => {
  pos.lastYleft += 30;
  if (resume.skills !== 0) {
    doc.setFont("Oswald-Regular", "normal").setFontSize(9);
    doc.setCharSpace(1);
    circledHeader(1.6, "SKILLS", 1, doc, pos);
    doc.setCharSpace(0.5);
    doc.setFont("SourceSansPro", "normal");
    doc.setFontSize(9).setLineHeightFactor(1.5);
    pos.lastYleft += 20;

    const sorted = resume.skills.sort(
      (a, b) => b.skill.length - a.skill.length
    );

    sorted.forEach((skill) => {
      doc.text(skill.skill, pos.xLeft, pos.lastYleft, {
        align: "center",
      });
      pos.lastYleft += 15;
    });
  }
};

const timelinePar = (x, y, rad, par, space, width, doc, pos) => {
  const dim = doc.getTextDimensions(par);
  const lineHeight = doc.getTextDimensions("some text");

  doc.text(x, y, par);
  doc.setLineWidth(width);
  doc.circle(x - space, y - lineHeight.h / 4, rad);
  doc.line(
    x - space,
    y - lineHeight.h / 4 + rad,
    x - space,
    y - lineHeight.h * 1.3 - rad + dim.h + 4
  );
  // doc.circle(x - space, y + dim.h - lineHeight.h * 1.3, rad)
  pos.lastYRight += dim.h;
};

const timelineMul = (
  rad,
  data,
  space,
  width,
  doc,
  font,
  type,
  pos,
  tempTime
) => {
  const x = pos.xRight;
  const y = pos.lastYRight;
  doc.setFont(font, type);
  doc.text(x, y, data[0]);
  doc.setFontSize(9).setTextColor(130, 139, 162);
  pos.lastYRight += 14;

  const hyperLink = data[1][0].startsWith("http://")
    ? data[1]
    : data[1][0].startsWith("www")
    ? "http://" + data[1]
    : data[0];

  doc.text(x, pos.lastYRight, hyperLink);
  doc.setTextColor(0, 0, 0);
  doc.setLineWidth(width);
  doc.circle(x - space, y - 2.875, rad);
  if (tempTime.on) {
    doc.line(x - space, y - 2.875 - rad, x - space, tempTime.last);
    tempTime.last = y - 2.875 + rad;
    tempTime.on = true;
    const halfCircle = y - 2.875 + rad;
    const par =
      y -
      2.875 -
      rad +
      doc.getTextDimensions(data[0]).h +
      doc.getTextDimensions(data[1]).h;
    doc.line(x - space, halfCircle, x - space, par);

    tempTime.last = y - 2.875 + rad;
    pos.lastYRight = par;
  } else {
    tempTime.on = true;
    const halfCircle = y - 2.875 + rad;
    const par =
      y -
      2.875 -
      rad +
      doc.getTextDimensions(data[0]).h +
      doc.getTextDimensions(data[1]).h;
    doc.line(x - space, halfCircle, x - space, par);

    tempTime.last = y - 2.875 + rad;
    pos.lastYRight = par;
  }
};

const timeLineYear = (
  rad,
  data,
  space,
  width,
  doc,
  font,
  type,
  pos,
  tempTime
) => {
  const x = pos.xRight;
  const y = pos.lastYRight;
  doc.setFont(font, "bold").setFontSize(11.5);
  doc.text(x, y, data[0]);
  doc.setFont(font, type);
  doc.setTextColor(130, 139, 162);
  pos.lastYRight += 14;
  doc.text(x, pos.lastYRight, data[2]);
  pos.lastYRight += 16;
  doc.setFontSize(9).setTextColor(0, 0, 0);
  doc.text(x, pos.lastYRight, data[1]);
  doc.setLineWidth(width);
  doc.circle(x - space, y - 2.875, rad);
  if (tempTime.on) {
    doc.line(x - space, y - 2.875 - rad, x - space, tempTime.last);
    tempTime.last = y - 2.875 + rad;
    tempTime.on = true;
    const halfCircle = y - 2.875 + rad;
    const par =
      y -
      2.875 -
      rad +
      doc.getTextDimensions(data[0]).h +
      doc.getTextDimensions(data[1]).h +
      doc.getTextDimensions(data[2]).h +
      7;
    doc.line(x - space, halfCircle, x - space, par);

    tempTime.last = y - 2.875 + rad;
    pos.lastYRight = par;
  } else {
    tempTime.on = true;
    const halfCircle = y - 2.875 + rad;
    const par =
      y -
      2.875 -
      rad +
      doc.getTextDimensions(data[0]).h +
      doc.getTextDimensions(data[1]).h +
      doc.getTextDimensions(data[2]).h +
      7;
    doc.line(x - space, halfCircle, x - space, par);

    tempTime.last = y - 2.875 + rad;
    pos.lastYRight = par;
  }
};

const circledHeader = (rad, header, width, doc, pos) => {
  const headerWidth = doc.getTextWidth(header);
  doc.text(header, pos.xLeft, pos.lastYleft, {
    align: "center",
  });
  doc.setLineWidth(width);
  doc.circle(
    pos.xLeft - headerWidth / 2 - 10,
    pos.lastYleft - doc.getTextDimensions(header).h / 3,
    rad
  );
  doc.circle(
    pos.xLeft - headerWidth / 2 + doc.getTextWidth(header) + 10,
    pos.lastYleft - doc.getTextDimensions(header).h / 3,
    rad
  );
};

const getBlockText = (blocks) => {
  var text = [];

  blocks.forEach((block) => {
    text.push(block.text);
  });

  return text.join("\n");
};
