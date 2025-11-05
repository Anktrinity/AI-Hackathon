# 🏆 Wellness Awards 2025 - Slack Integration Guide

## For: Ari & David

---

## 📱 What You Can Do in Slack

Your Wellness Awards 2025 project is now fully integrated with Slack! You can manage all your event tasks directly from the **#wellness-awards** channel without ever leaving Slack.

### ✨ Quick Overview

- **Create new tasks** right from Slack
- **Assign tasks** to team members (supports multi-word names!)
- **Mark tasks complete** with automatic progress tracking
- **View project status** and task lists anytime
- **Get automated updates** with daily standups and weekly reports
- **Real-time sync** - Everything updates instantly in both Slack and the dashboard

---

## 🎯 Available Commands

Type these commands in your Slack workspace:

### 1️⃣ Create a New Task
```
/wellness create [task name]
```

**Examples:**
- `/wellness create Canva design of graphics`
- `/wellness create Send out intake form`
- `/wellness create Update website with winners`

**What happens:**
- ✅ Task appears instantly in your UI dashboard
- 📢 Notification posted to #wellness-awards
- 👤 Task auto-assigned to you (the creator)

---

### 2️⃣ Assign a Task to Someone
```
/wellness assign [task name] to [person name]
```

**Examples:**
- `/wellness assign Canva design to Rob Thomas`
- `/wellness assign Send out intake form to David Smith`
- `/wellness assign Update website to @ariadni` (you can also use @mentions!)

**What happens:**
- 📋 Task gets assigned to that person
- 📢 Notification posted to #wellness-awards
- ✅ Updates immediately in the dashboard

---

### 3️⃣ Mark a Task as Complete
```
/wellness complete [task name]
```

**Examples:**
- `/wellness complete Canva design of graphics`
- `/wellness complete Send out intake form`

**What happens:**
- ✅ Task marked as complete
- 📊 Progress percentage updated
- 🎉 Celebration message if you hit milestones (25%, 50%, 75%, 100%)
- ✅ Updates immediately in the dashboard

---

### 4️⃣ View All Tasks
```
/wellness tasks
```

**Shows you:**
- All Wellness Awards tasks organized by status
- In Progress, Pending, and Completed sections
- Task titles and assignees

---

### 5️⃣ Check Project Status
```
/wellness status
```

**Shows you:**
- Overall completion percentage
- Total tasks, completed, in progress, pending
- Number of overdue tasks
- Quick progress overview

---

### 6️⃣ Get Help
```
/wellness
```

Shows all available commands with examples

---

## 🔄 How It Works with the Dashboard

### Two-Way Sync (Real-Time!)

**From Slack → Dashboard:**
1. Create a task in Slack
2. It instantly appears in your web dashboard
3. Assign or complete it in Slack
4. Dashboard updates in real-time

**From Dashboard → Slack:**
1. Create a task in the web dashboard
2. Manage it using Slack commands
3. All changes sync back to the dashboard

### 🤖 Automated Updates (You Don't Need to Do Anything!)

**Daily Standup (9 AM every day)**
- Posted to #wellness-awards
- Shows tasks due today
- Lists in-progress tasks
- Highlights overdue items
- Uses real @mentions to notify assignees

**Weekly Progress Report (Friday)**
- Posted to #wellness-awards
- Full week summary with stats
- Completed tasks celebration
- Upcoming priorities for next week
- Team velocity metrics

**Smart Notifications:**
- 🆕 New task created → Posted to channel
- ✅ Task completed → Celebration message
- ⚠️ 24 hours before deadline → Warning alert
- 🚨 Task overdue → Urgent notification
- 🎉 Milestones (25%, 50%, 75%, 100%) → Team celebration

---

## 💡 Pro Tips

1. **Multi-word names work!** 
   - ✅ `/wellness assign Design graphics to Rob Thomas`
   - Use "to" as the separator

2. **Partial task names work!**
   - If your task is "Update Logo to 2025"
   - You can type: `/wellness complete Update Logo`
   - It will find the matching task

3. **Use @mentions for assignments!**
   - `/wellness assign Task name to @david`
   - This ensures proper Slack notifications

4. **Check before you create!**
   - Use `/wellness tasks` to see existing tasks
   - Avoid duplicate task creation

5. **Watch for milestone celebrations!**
   - The system celebrates when you hit 25%, 50%, 75%, and 100% completion
   - Great for team morale! 🎉

---

## 📊 Typical Workflow Example

```bash
# 1. Create a new task
/wellness create Finalize venue contract

# 2. Assign it to David
/wellness assign Finalize venue to David Smith

# 3. Check all tasks
/wellness tasks

# 4. Mark it complete when done
/wellness complete Finalize venue

# 5. Check overall progress
/wellness status
```

---

## 🎯 Where to Use These Commands

- **#wellness-awards channel** - Best place for team visibility
- **Direct messages with the bot** - Works here too for private task management
- **Any channel** where the AI Task Manager bot is invited

---

## ❓ Common Questions

**Q: Do I need to open the dashboard at all?**
A: No! You can manage everything from Slack. The dashboard is there when you need a visual overview.

**Q: What if I make a typo in a task name?**
A: The system uses fuzzy matching - it finds tasks even with partial names.

**Q: Can I see who's assigned to what?**
A: Yes! Use `/wellness tasks` to see all tasks with assignees.

**Q: What happens to tasks created in the dashboard?**
A: They're immediately available in Slack - you can assign, complete, or view them using the commands.

**Q: Will I get notified when assigned a task?**
A: Yes! When someone uses @mentions or assigns using your name, you'll get a Slack notification.

---

## 🚀 Getting Started (Right Now!)

1. Open your #wellness-awards Slack channel
2. Type: `/wellness create Test task from Slack`
3. Check your dashboard - it's there instantly!
4. Try: `/wellness complete Test task`
5. You're all set! 🎉

---

**Need help?** Type `/wellness` in Slack for quick reference anytime!

**Questions?** Reach out in #wellness-awards or check the web dashboard for visual task management.

---

*Last Updated: October 16, 2025*
*Powered by AI Task Manager - Your intelligent event management assistant*
