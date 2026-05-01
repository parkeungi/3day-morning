const pad = (n) => String(n).padStart(2, '0');

export function nowISO() {
  return new Date().toISOString();
}

export function formatUTC(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
}

export function formatLocal(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function formatUTCShort(date) {
  if (!date) return '--:--';
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}Z`;
}

export function localTimezoneLabel() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'LOC';
    const map = { 'Asia/Seoul': 'KST', 'Asia/Tokyo': 'JST', UTC: 'UTC' };
    return map[tz] || tz.split('/').pop().slice(0, 4).toUpperCase();
  } catch {
    return 'LOC';
  }
}

export function diffMs(fromISO, toISO = nowISO()) {
  if (!fromISO) return 0;
  return new Date(toISO).getTime() - new Date(fromISO).getTime();
}

export function formatDuration(ms) {
  if (!ms || ms < 0) return '00:00:00';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function toLocalInputValue(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function fromLocalInputValue(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}
