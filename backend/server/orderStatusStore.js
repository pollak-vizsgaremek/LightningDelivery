import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATUS_FILE = path.join(__dirname, "..", "data", "order-status.json");

const ensureStoreFile = async () => {
  await fs.mkdir(path.dirname(STATUS_FILE), { recursive: true });

  try {
    await fs.access(STATUS_FILE);
  } catch {
    await fs.writeFile(STATUS_FILE, "{}", "utf-8");
  }
};

const readStatusMap = async () => {
  await ensureStoreFile();

  try {
    const raw = await fs.readFile(STATUS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeStatusMap = async (statusMap) => {
  await ensureStoreFile();
  await fs.writeFile(STATUS_FILE, JSON.stringify(statusMap, null, 2), "utf-8");
};

export const getOrderStatus = async (orderId) => {
  const statusMap = await readStatusMap();
  return statusMap[String(orderId)] ?? "UJ";
};

export const setOrderStatus = async (orderId, status) => {
  const statusMap = await readStatusMap();
  statusMap[String(orderId)] = status;
  await writeStatusMap(statusMap);
};

export const getOrderStatuses = async (orderIds) => {
  const statusMap = await readStatusMap();
  const result = {};

  for (const orderId of orderIds) {
    result[String(orderId)] = statusMap[String(orderId)] ?? "UJ";
  }

  return result;
};
