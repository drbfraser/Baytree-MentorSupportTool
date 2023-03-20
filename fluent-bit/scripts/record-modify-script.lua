function replace_sensitive(tag, timestamp, record)
  if record["log"] and record["log"]["params"] and record["log"]["params"]["password"] then
    record["log"]["params"]["password"] = "<HIDDEN>"
  end
  return 2,timestamp,record
end