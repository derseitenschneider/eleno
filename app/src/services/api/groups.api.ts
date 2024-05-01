import supabase from "./supabase";
import type { Tables } from "../../types/supabase";

export const fetchGroups = async () => {
	const { data: groups, error } = await supabase.from("groups").select("*");

	if (error) throw new Error(error.message);
	return groups;
};

export const createNewGroupSupabase = async (group: Tables<"groups">) => {
	const { data: newGroup, error } = await supabase
		.from("groups")
		.insert(group)
		.select();
	if (error) throw new Error(error.message);
	return newGroup;
};

export const deactivateGroupSupabase = async (groupIds: number[]) => {
	const { error } = await supabase
		.from("groups")
		.update({ archive: true })
		.in("id", groupIds);

	if (error) throw new Error(error.message);
};

export const reactivateGroupsSupabase = async (groupIds: number[]) => {
	const { error } = await supabase
		.from("groups")
		.update({ archive: false })
		.in("id", groupIds);

	if (error) throw new Error(error.message);
};

export const deleteGroupsSupabase = async (groupIds: number[]) => {
	const { error } = await supabase.from("groups").delete().in("id", groupIds);

	if (error) throw new Error(error.message);
};

export const updateGroupSupabase = async (group: Tables<"groups">) => {
	const { error } = await supabase.from("groups").upsert(group);

	if (error) throw new Error(error.message);
};
