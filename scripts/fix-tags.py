from pathlib import Path

close_div = "</" + "div>"

projects = Path("app/(site)/projects/page.tsx")
text = projects.read_text(encoding="utf-8")
text = text.replace(
    '<motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">',
    '<motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">'.replace(
        "<motion.div", "<" + "div"
    ),
)
text = text.replace(
    "      </motion.div>\n    </>\n  )\n}\n\nexport default function ProjectsPage",
    f"      {close_div}\n    </>\n  )\n}}\n\nexport default function ProjectsPage".replace("}}\n", "}\n"),
)
projects.write_text(text, encoding="utf-8")

gallery = Path("app/(site)/gallery/page.tsx")
g = gallery.read_text(encoding="utf-8")
g = g.replace(
    "                  </motion.div>\n                </motion.div>",
    f"                  {close_div}\n                </motion.div>",
)
g = g.replace(
    "            </motion.div>\n          </Container>",
    f"            {close_div}\n          </Container>",
)
gallery.write_text(g, encoding="utf-8")

lightbox = Path("components/site/image-lightbox.tsx")
lb = lightbox.read_text(encoding="utf-8")
lb = lb.replace(
    "      </motion.div>\n    </motion.div>\n  )\n}",
    f"      {close_div}\n    </motion.div>\n  )\n}}".replace("}}\n", "}\n"),
)
lightbox.write_text(lb, encoding="utf-8")

print("ok")
